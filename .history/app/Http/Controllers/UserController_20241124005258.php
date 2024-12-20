<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Mail\createUser;
use App\Mail\ResetPasswordMail;
use Inertia\Inertia;


class UserController extends BaseCrudController
{
    protected $model;
    public function __construct()
    {
        $this->model =  User::class;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = $this->model::with('roles')->get();
        $roles = Roles::all();
        return Inertia::render('User/Index', ['roles' => $roles, 'users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }
    /**
     * Display the specified resource.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'idRole' => 'required|exists:roles,id'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        $password = random_int(10000, 99999);
        $data['password'] = Hash::make($password);
        User::create($data);
        $data = [
            'email' => $request->email,
            'password' => $password,
        ];
        Mail::to($request->email)->send(new createUser($data));
        $users = $this->model::with('roles')->get();
        return response()->json(['check' => true, 'data' => $users]);
    }
    public function register(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|min:2',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&.]/'
            ],
            'phone' => 'required|string|max:10|min:0|regex:/^(0[1-9]{1})([0-9]{8})$/',
            'avatar' => 'nullable|image|max:2048',
        ], [
            // Thông báo lỗi cho 'name'
            'name.required' => 'Vui lòng nhập tên.',
            'name.string' => 'Tên không chứa kí tự số.',
            'name.max' => 'Tên không được quá 255 ký tự.',
            'name.min' => 'Tên phải lớn hơn 2 ký tự.',
        
            // Thông báo lỗi cho 'email'
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'email.max' => 'Email không được quá 255 ký tự.',
            'email.unique' => 'Email đã được sử dụng.',
        
            // Thông báo lỗi cho 'password'
            'password.required' => 'Mật khẩu không được để trống.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.regex' => 'Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.',
        
            // Thông báo lỗi cho 'phone'
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.max' => 'Số điện thoại không được quá 10 ký tự.',
            'phone.min' => 'Số điện thoại sai định dạng.',
            'phone.regex' => 'Số điện thoại không đúng định dạng.',
        
            // Thông báo lỗi cho 'avatar'
            'avatar.image' => 'Ảnh đại diện phải là một tệp hình ảnh.',
            'avatar.max' => 'Ảnh đại diện không được quá 2MB.',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $avatarUrl = Storage::url($avatarPath);
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'avatar' => $avatarUrl,
                'idRole' => 2,
            ]);
        } else {
            $user = User::create([

             'name' => $request->name,
             'email' => $request->email,
             'password' => Hash::make($request->password),
             'phone' => $request->phone,
             'avatar' => "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
             'idRole' => 2,


            ]);
        }
    
        // Gửi email xác nhận
        Mail::to($user->email)->send(new createUser($user));
    
        // Trả về thông báo thành công và thông tin người dùng
        $users = User::with('roles')->where('id', $user->id)->get();
        return response()->json([
            'check' => true,
            'data' => $users,
            'message' => 'Đăng kí tài khoản thành công'
            
        ], 201);
        
    }
    

    public function login(Request $request)
    {
        // Validate các trường dữ liệu trong request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',  
            'password' => 'required|string|min:8',  
        ], [
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không hợp lệ.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->toArray()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        $role = Roles::find($user->idRole);
        if ($role->name != "admin"){
            return response()->json([
                'errors' => [
                    'email' => ['Tài khoản không có quyền đăng nhập.']
                ]
            ], 401);
        }

        if (!$user) {
            return response()->json([
                'errors' => [
                    'email' => ['Email này chưa được đăng ký.']
                ]
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    'password' => ['Mật khẩu không chính xác.']
                ]
            ], 401);
        }
    
        $token = $user->createToken('YourAppName')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => asset($user->avatar),
                'phone' => $user->phone
            ]
        ], 200);
    }


    public function registerForm()
    {
        return Inertia::render('User/Register');
    }
    public function loginForm()
    {
        return Inertia::render('User/Login');
    }
   
    public function logout()
    {
        Auth::logout();
        return redirect('/'); 
    }
    public function getUserInfo()
    {
        $user = Auth::user();
        return response()->json($user);
    }
    public function updateUser(Request $request)
{
    $userId = $request->id;
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    $validatedData = [];

    if ($request->has('name')) {
        $request->validate([
            'name' => 'required|string|min:2|max:255',
        ], [
            'name.required' => 'Vui lòng nhập họ và tên.',
            'name.min' => 'Họ và tên phải có ít nhất 2 ký tự.',
            'name.max' => 'Họ và tên không được quá 255 ký tự.',
        ]);
        $validatedData['name'] = $request->name;
    }

    if ($request->has('phone')) {
        $request->validate([
            'phone' => 'required|string|digits:10',
        ], [
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.digits' => 'Số điện thoại phải gồm 10 chữ số.',
        ]);
        $validatedData['phone'] = $request->phone;
    }

    // Kiểm tra mật khẩu
 // Kiểm tra mật khẩu
if ($request->has('currentPassword') && $request->has('newPassword') && $request->has('newPassword_confirmation')) {
    $request->validate([
        'currentPassword' => 'required|string',
        'newPassword' => [
            'required',
            'string',
            'min:8',
            'regex:/[A-Z]/',
            'regex:/[a-z]/',
            'regex:/\d/',
            'regex:/[@$!%*?&.]/',
            'confirmed',
        ],
    ], [
        'currentPassword.required' => 'Vui lòng nhập mật khẩu hiện tại.',
        'newPassword.required' => 'Vui lòng nhập mật khẩu mới.',
        'newPassword.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
        'newPassword.regex' => 'Mật khẩu mới phải có chữ hoa, chữ thường, số và ký tự đặc biệt.',
        'newPassword.confirmed' => 'Mật khẩu mới và xác nhận không khớp.',
    ]);

    // Xác minh mật khẩu hiện tại
    if (!Hash::check($request->currentPassword, $user->password)) {
        return response()->json(['errors' => ['currentPassword' => 'Mật khẩu hiện tại không đúng.']], 422);
    }

    // Kiểm tra nếu mật khẩu mới giống mật khẩu cũ
    if (Hash::check($request->newPassword, $user->password)) {
        return response()->json(['errors' => ['newPassword' => 'Mật khẩu mới phải khác mật khẩu hiện tại.']], 422);
    }

    // Lưu mật khẩu mới đã mã hóa
    $validatedData['password'] = Hash::make($request->newPassword);
} elseif ($request->has('currentPassword') || $request->has('newPassword') || $request->has('newPassword_confirmation')) {
    return response()->json(['errors' => ['general' => 'Vui lòng điền đầy đủ thông tin mật khẩu.']], 422);
}


    // Cập nhật ảnh đại diện nếu có
    if ($request->hasFile('avatar')) {
        if ($user->avatar && !filter_var($user->avatar, FILTER_VALIDATE_URL)) {
            Storage::delete($user->avatar);
        }

        $avatarPath = $request->file('avatar')->store('avatars', 'public');
        $avatarUrl = url(Storage::url($avatarPath));
        $validatedData['avatar'] = $avatarUrl;
    }

    // Cập nhật thông tin người dùng
    $user->update($validatedData);

    return response()->json([
        'message' => 'Cập nhật thông tin thành công.',
        'user' => $user,
    ], 200);
}

    
public function info(Request $request)
{
    $user = $request->user();
    return response()->json($user);
}

    public function forgotPassForm()
    {
        return Inertia::render('User/Forgot');
    }




    public function sendResetLinkEmail(Request $request)
{
    // Thêm điều kiện validate chi tiết hơn
    $validator = Validator::make($request->all(), [
        'email' => [
            'required',
            'email',
            function ($attribute, $value, $fail) {
                $user = User::where('email', $value)->first();
                if (!$user) {
                    $fail('Email không tồn tại trong hệ thống.');
                }
            }
        ],
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        $response = Password::sendResetLink($request->only('email'), function ($user, $token) {
            $data = [
                'name' => $user->name,
                'reset_link' => url('/api/reset-password/' . $token . '/' . urlencode($user->email)),
            ];
            Mail::to($user->email)->send(new ResetPasswordMail($data));
        });

        if ($response) {
            return response()->json(['message' => 'Vui lòng kiểm tra email để thay đổi mật khẩu.'], 200);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Đã xảy ra lỗi khi gửi liên kết. Vui lòng thử lại sau.'], 500);
    }

    return response()->json(['error' => 'Không thể gửi liên kết.'], 500);
}


    public function resetPassword(Request $request)
{
    // Validate các thông tin đầu vào
    $validator = Validator::make($request->all(), [
        'token' => 'required',
        'password' => [
            'required',
            'confirmed',
            'min:8',
            'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/',
        ],
        'password_confirmation' => 'required',
    ], [
        'password.regex' => 'Mật khẩu phải bao gồm ít nhất 8 ký tự, trong đó có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.',
        'email.exists' => 'Email không tồn tại trong hệ thống.',
        'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
        'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự.',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Thực hiện reset mật khẩu
    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user) use ($request) {
            $user->password = Hash::make($request->password);
            $user->save();
        }
    );

    
    if ($status === Password::PASSWORD_RESET) {

        return response()->json([
            'status' => 'Mật khẩu đã được cập nhật thành công!',
            'redirect' => url('/login') 
        ], 200);
    }

    return response()->json(['errors' => ['token' => 'Token không hợp lệ hoặc đã hết hạn.']], 422);
}

public function resetForm($token, $email)
{
    return Inertia::render('User/ResetPass', [
        'token' => $token,
        'email' => $email,
    ]);
}
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'email|unique:users,email',
            'idRole' => 'exists:roles,id'
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = $request->all();
        if ($request->has('status')) {
            $old = User::find($id)->value('status');
            if ($old == 0) {
                $new = 1;
            } else {
                $new = 0;
            }
            $data['status'] = $new;
        }
        User::findOrFail($id)->update($data);
        $users = User::with('roles')->get();
        return response()->json(['check' => true, 'data' => $users]);
    }
  
    public function edit(User $user)
    {
        //
    }
   
   public function destroy($id)
   {
       // Tìm kiếm người dùng theo ID
       $user = User::find($id);
   
       if (!$user) {
           return response()->json(['message' => 'Tài khoản không tồn tại'], 404);
       }
   
       try {

           $orders = $user->orders; 
   
           foreach ($orders as $order) {
               $order->orderDetails()->delete();
           }
           $user->delete();
   
           return response()->json(['message' => 'Tài khoản và các dữ liệu liên quan đã được xóa thành công.'], 200);
       } catch (\Exception $e) {
           return response()->json(['message' => 'Có lỗi xảy ra khi xóa tài khoản.', 'error' => $e->getMessage()], 500);
       }
   }
   
   
    
    
}
