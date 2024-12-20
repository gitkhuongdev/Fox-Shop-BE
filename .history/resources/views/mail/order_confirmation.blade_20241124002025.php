<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
    <style>
        /* CSS cho email */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333333;
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
        }

        p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        ul {
            list-style-type: none;
            padding: 0;
            font-size: 16px;
            margin-bottom: 20px;
        }

        ul li {
            margin: 8px 0;
            color: #555555;
        }

        .order-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #ddd;
        }

        .order-details li {
            font-weight: bold;
        }

        .total-amount {
            font-size: 18px;
            font-weight: bold;
            color: #e74c3c;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
        }

        .footer a {
            color: #3498db;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!</h1>
        <p>Chúng tôi đã nhận được đơn hàng của bạn và hiện đang xử lý. Dưới đây là thông tin chi tiết về đơn hàng của bạn:</p>
        
        <div class="order-details">
            <ul>
                <li>Mã đơn hàng: <strong>{{ $order->id }}</strong></li>
                <li>Tổng tiền: <span class="total-amount">{{ number_format($order->total_amount, 0, ',', '.') }} VNĐ</span></li>
                <li>Địa chỉ giao hàng: {{ $order->address }}</li>
                <li>
                    Phương thức thanh toán: 
                    @if($order->payment_method == 1)
                        Thanh toán qua VN Pay
                    @elseif($order->payment_method == 2)
                        Thanh toán khi nhận hàng
                    @else
                        Phương thức thanh toán không xác định
                    @endif
                </li>
            </ul>
        </div>
        
        <p>Cảm ơn bạn đã tin tưởng mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn sẽ được xử lý và giao đến bạn trong thời gian sớm nhất!</p>

        <div class="footer">
            <p>Liên hệ với chúng tôi qua <a href="mailto:support@foxshop.com">support@foxshop.com</a> nếu bạn có bất kỳ câu hỏi nào.</p>
            <p>Địa chỉ cửa hàng: 123 Đường ABC, Quận XYZ, Thành phố HCM</p>
        </div>
    </div>
</body>
</html>
