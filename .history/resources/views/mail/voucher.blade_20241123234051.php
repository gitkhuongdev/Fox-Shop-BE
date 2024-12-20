<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voucher Của Bạn</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; text-align: center;">
        <h1 style="color: #4CAF50;">Chúc Mừng Bạn!</h1>
        <p style="font-size: 16px; color: #333;">Săn mã voucher nào!:</p>
        <h2 style="font-size: 28px; color: #4CAF50; margin: 20px 0;">{{ $data['code'] }}</h2>
        <p style="font-size: 16px; color: #333;">Giảm giá {{ $data['discount_value'] }} cho đơn hàng tiếp theo của bạn!</p>
        <p style="font-size: 14px; color: #888;">Cảm ơn bạn đã đồng hành cùng chúng tôi!</p>
        <a href="https://foxshop.trungthanhzone.com/voucher" 
           style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #fff; background-color: #4CAF50; border-radius: 5px; text-decoration: none; margin-top: 20px;">
            Nhận Voucher
        </a>
    </div>
</body>
</html>
