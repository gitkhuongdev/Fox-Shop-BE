<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class VoucherController extends Controller
{
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
        return response()->json(['check'=> true,'data'=> $this->model::all()]);
    }
    public function show($id)
    {
        $result = $this->model::find($id);
        return Inertia::render('Vouchers/Edit', ['vouchers' => $result]);
    }
    public function UploadStatus(Request $request, $id){
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
    /**
     * Update the specified resource in storage.
     */
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