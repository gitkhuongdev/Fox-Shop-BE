<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác minh tài khoản</title>
    <style>
        /* Reset CSS */
        body,
        h1,
        p {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
        }

        /* Box Container */
        .email-box {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            font-size: 16px;
            color: #333;
        }

        /* Heading */
        .email-box h1 {
            text-align: center;
            background-color: #333;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        /* Body Text */
        .email-box ul {
            list-style-type: none;
            padding: 0;
        }

        .email-box li {
            font-size: 18px;
            line-height: 1.5;
            margin-bottom: 10px;
        }

        /* Button */
        .email-box a {
            display: inline-block;
            padding: 12px 25px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
            background-color: #007bff;
            border-radius: 5px;
            text-decoration: none;
            text-align: center;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }

        .email-box a:hover {
            background-color: #0056b3;
        }

        /* Responsive Styles */
        @media screen and (max-width: 767px) {
            .email-box {
                width: 90%;
            }
        }
    </style>
</head>

<body>
    <div class="email-box">
        <h1>Xác minh tài khoản</h1>
        <ul>
            <li> Email: {{$user->email}}</li>
        </ul>
        <a href="{{ url('/verify/' . $user->id) }}">Xác nhận tài khoản</a>
    </div>
</body>

</html>
