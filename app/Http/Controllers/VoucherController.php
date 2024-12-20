<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use App\Models\User;
use App\Models\UserVoucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\VoucherMail;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class VoucherController extends Controller
{
    protected $model;
    public function __construct(Voucher $model){
        $this->model = Voucher::class;
    }
    public function index()
    {
        $voucher = Voucher::all();
        return Inertia::render('Vouchers/Index', ['voucher'=>$voucher]);
    }

  
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code'=> 'required|string',
            'type'=> 'required',
            'value'=> 'required',
            'monney'=> 'required',
            'start'=> 'required|date',
            'end'=> 'required|date',
            'limit'=> 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = [];
        $data['code'] = $request->code;
        $data['discount_type'] = $request->type;
        $data['discount_value'] = $request->value;
        $data['start_date'] = $request->start;
        $data['end_date'] = $request->end;
        $data['usage_limit'] = $request->limit;
        $data['minimum_monney'] = $request->monney;
        $this->model::create($data);
        $voucher = new Voucher($data);
        $userEmails = User::pluck('email');
        if ($userEmails->count() > 0) {
            foreach ($userEmails as $email) {
                Mail::to($email)->send(new VoucherMail($voucher));
            }
        }
        return response()->json(['check'=> true,'data'=> $this->model::all()]);
    }
    public function show($id)
    {
        $result = $this->model::find($id);
        return Inertia::render('Vouchers/Edit', ['vouchers' => $result]);
    }
    public function UploadStatus(Request $request, $id){
        $voucher = $this->model::find($id);
        if (!$voucher) {
            return response()->json(['error' => 'Không tìm thấy voucher'], 404);
        }
        $voucher->status = $request->status;
        $voucher->save();
        return response()->json(['check' => true, 'data' => $this->model::all()]);
    }
    public function updateVoucher(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'code'=> 'required|string',
            'type'=> 'required',
            'value'=> 'required',
            'monney'=> 'required',
            'start'=> 'required|date',
            'end'=> 'required|date',
            'limit'=> 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = [];
        $data['code'] = $request->code;
        $data['discount_type'] = $request->type;
        $data['discount_value'] = $request->value;
        $data['minimum_monney'] = $request->monney;
        $data['usage_limit'] = $request->limit;
        $data['start_date'] = $request->start;
        $data['end_date'] = $request->end;
        $this->model::find($id)->update($data);
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
    public function switchVoucher(Request $request, $identifier)
    {
        $result = Voucher::findOrFail($identifier);
        if (!$result) {
        return response()->json(['check' => false, 'msg' => 'Not exists']);
        }
        $old = $result->status;
        if ($old == 0) {
            Voucher::where('id', $identifier)->update(['status' => 1]);
        } else {
            Voucher::where('id', $identifier)->update(['status' => 0]);
        }
        $result = $this->model::with('Vouchers')->get();
        return response()->json(['check' => true, 'data' => $result]);
    }
    public function edit(Voucher $voucher)
    {
        //
    }

    public function getUserVouchers(Request $request)
{
    $userId = $request->userId; // hoặc lấy từ JWT token

    // Kiểm tra userId
    if (!$userId) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }
    $vouchers = Voucher::where('usage_limit', '>', 0) 
        ->whereDate('end_date', '>', now()) 
        ->get();

    return response()->json([
        'vouchers' => $vouchers
    ]);
}

public function receiveVoucher(Request $request, $voucherId)
{
    $user = $request->userid;
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    $voucher = Voucher::find($voucherId);
    if (!$voucher) {
        return response()->json(['error' => 'Voucher not found'], 404);
    }

    if ($voucher->usage_limit <= 0) {
        return response()->json(['error' => 'Voucher has no more uses left'], 400);
    }

    // Kiểm tra nếu người dùng đã nhận voucher này rồi
    $existingVoucher = UserVoucher::where('user_id', $user)
        ->where('voucher_id', $voucherId)
        ->first();

    if ($existingVoucher) {
        return response()->json(['error' => 'Voucher already received'], 400);
    }

    // Thực hiện lưu voucher vào bảng UserVoucher
    $userVoucher = new UserVoucher();
    $userVoucher->user_id = $user;
    $userVoucher->voucher_id = $voucherId;
    $userVoucher->save();

    // Giảm số lượng voucher còn lại
    $voucher->usage_limit = $voucher->usage_limit - 1;
    $voucher->save();

    return response()->json(['message' => 'Voucher received successfully'], 200);
}


    public function api_voucher_user_voucher(Request $request, $id){
        if (!$id) {
            return response()->json(['error' => 'Chưa có user'], 400);
        }
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User không tồn tại'], 404);
        }
        $user->load('vouchers');
    
        return response()->json([
            'check' => true,
            'data' => $user->vouchers
        ]);
    }


    public function validateVoucher(Request $request)
    {
        $voucherCode = $request->voucher_code;
        $totalAmount = $request->total_amount;
    
        $voucher = Voucher::where('code', $voucherCode)->first();
    
        if (!$voucher) {
            return response()->json(['check' => false, 'msg' => 'Voucher không tồn tại'], 404);
        }
    
        if (now() < $voucher->start_date || now() > $voucher->end_date) {
            return response()->json(['check' => false, 'msg' => 'Voucher đã hết hạn'], 400);
        }
    
        if ($totalAmount < $voucher->minimum_monney) {
            return response()->json(['check' => false, 'msg' => 'Không đủ số tiền tối thiểu'], 400);
        }
    
        if ($voucher->usage_limit <= 0) {
            return response()->json(['check' => false, 'msg' => 'Voucher đã hết số lần sử dụng'], 400);
        }
    
        $discount = $voucher->discount_type === 'percentage' 
            ? $totalAmount * ($voucher->discount_value / 100) 
            : $voucher->discount_value;
    
        return response()->json([
            'check' => true,
            'discount' => min($discount, $totalAmount), // Không giảm quá tổng giá trị đơn hàng
        ]);
    }
    
    
    public function api_voucher_user(Request $request){
        $userId = $request->userid;
        if (!$userId) {
            return response()->json(['error' => 'Chưa có user'], 400);
        }
        $user = User::find($userId);
    
        if (!$user) {
            return response()->json(['error' => 'User không tồn tại'], 404);
        }
        $user->load('vouchers');
    
        return response()->json([
            'check' => true,
            'data' => $user->vouchers
        ]);
    }
      public function deleteVoucher(Request $request)
{
    $voucher = UserVoucher::where('voucher_id', $request->id_voucher)
                          ->where('user_id', $request->id_user)
                          ->first();

    if ($voucher) {
        $voucher->delete();
        return response()->json(['success' => true]);
    }
    return response()->json(['success' => false, 'message' => 'Voucher not found'], 404);
}

   
    public function update(Request $request, Voucher $voucher)
    {
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Voucher $voucher)
    {
        $voucher = $this->model::find($voucher->id);
        if(!$voucher){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy Voucher']);
        }
        $voucher->delete();
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
}