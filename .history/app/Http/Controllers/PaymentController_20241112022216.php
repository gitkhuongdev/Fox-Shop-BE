<?php
namespace App\Http\Controllers;
ob_start();
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Orders;
use App\Models\Order_detail;
use App\Models\Payment_management;
use App\Models\Products;
class PaymentController extends Controller
{
    protected $cart = [];
    public function vnpay_payment(Request $request)
    {
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
        date_default_timezone_set('Asia/Ho_Chi_Minh');
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = route('payment.return');
        $vnp_TmnCode = "M6KU6D0R";
        $vnp_HashSecret = "5J7EYR8GQ9ZX43F7HP9HI6JFVFVZCCBD";
        $order = new Orders();
        $order->id_user = $request->input('id_user');
        $order->id_payment = 2;
        $order->address = $request->input('address');
        $order->status = 'pending';
        $order->order_date = now();
        $order->order_note = $request->input('note');
        $order->total_amount = $request->input('total_amount');
        $order->save();
        $vnp_TxnRef = $order->id;
        $vnp_OrderInfo = "Thanh toán đơn hàng";
        $vnp_OrderType = "Hóa đơn từ Foxshop";
        $vnp_Amount = $order->total_amount;
        $vnp_Locale = "VN";
        $vnp_BankCode = "NCB";
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount*100,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );
        
        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }
        
        //var_dump($inputData);
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }
        
        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash; 
        }
        foreach ($request->input('order_details') as $detail) {
            Order_detail::create([
                'id_product' => $detail['id_product'],
                'id_order' => $order->id,
                'quantity' => $detail['quantity'],
                'color' => $detail['color'],
                'size' => $detail['size'],
                'total_money' => $detail['total_money'],
            ]);
            $product = Products::find($detail['id_product']);
            if ($product) {
                $newQuantity = $product->in_stock - $detail['quantity'];
                $product->update(['in_stock' => $newQuantity]);
            }
        }
       return response()->json(['message' => 'Order created successfully', 'url' => $vnp_Url]);
    }
    public function vnpayreturn(Request $request){
       $data =$request->all();
       return Inertia::render('Payment/Index', ['data' => $data]);
    }
    public function vnpay_data(Request $request){
        $order = Orders::find($request->data['vnp_TxnRef']);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        $order->status = 'Đã thanh toán';
        $order->save();
        $payment_management = new Payment_management();
        $payment_management->user_id = $request->id_user;
        $payment_management->order_id = $request->data['vnp_TxnRef']; 
        $payment_management->money = $request->data['vnp_Amount']; 
        $payment_management->note = $request->data['vnp_OrderInfo'];
        $payment_management->response_code = $request->data['vnp_ResponseCode'];
        $payment_management->code_vnpay = $request->data['vnp_TransactionNo'];
        $payment_management->code_bank = $request->data['vnp_BankCode'];
        $payment_management->date_bank = \Carbon\Carbon::createFromFormat('YmdHis', $request->data['vnp_PayDate']);
        $payment_management->save();
        return response()->json(['message' => 'Payment data saved successfully', 'payment_id' => $payment_management->id]);
    }

}
