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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:255|regex:/^(0[1-9]{1})([0-9]{8})$/',
            'avatar' => 'nullable|image|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $avatarUrl = Storage::url($avatarPath);
            \Log::info("Avatar path: " . $avatarUrl);
            $user = User::create([
             'name' => $request->name,
             'email' => $request->email,
             'phone' => $request->phone,
             'password' => Hash::make($request->password),
             'avatar' => $avatarUrl,
             'idRole' => 2,
            ]);
        }else{
            
            $user = User::create([
             'name' => $request->name,
             'email' => $request->email,
             'password' => Hash::make($request->password),
             'phone' => $request->phone,
             'avatar' => "/storage/avatars/c4RwwjBs5BM9vLufRAvwurArjQDAwoIrSeT8cgkh.png",
             'idRole' => 2,
            ]);
        }
         Mail::to($user->email)->send(new createUser($user));
        $users = User::with('roles')->where('id', $user->id)->get();
        return response()->json(['check' => true, 'data' => $users]);
        return response()->json(['message' => 'User registered successfully!'], 201);
    }
    public function registerForm()
    {
        return Inertia::render('User/Register');
    }
    public function loginForm()
    {
        return Inertia::render('User/Login');
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
        $user = Auth::user();
        if ($user) {
        $token = $user->createToken('YourAppName')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'phone' => $user->phone
            ]
        ], 200);
    } else {
        return response()->json(['error' => 'Login failed, user not found.'], 401);
    }
        }

        return response()->json(['error' => 'Unauthorized'], 401);
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

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'phone' => 'required|string|max:15|unique:users,phone,' . $user->id,
        'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('avatar')) {
        // Xóa ảnh cũ nếu có
        if ($user->avatar) {
            Storage::delete($user->avatar);
        }

        $avatarPath = $request->file('avatar')->store('avatars', 'public');
        $avatarUrl = Storage::url($avatarPath);
        $validatedData['avatar'] = $avatarUrl;
    }

    // Cập nhật thông tin người dùng
    $user->update($validatedData);

    // Trả về thông tin người dùng đã cập nhật
    return response()->json([
        'message' => 'User updated successfully',
        'user' => $user
    ], 200);
}


    public function info()
    {
       return Inertia::render('User/Info');
    }

    public function forgotPassForm()
    {
        return Inertia::render('User/Forgot');
    }




public function sendResetLinkEmail(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $response = Password::sendResetLink($request->only('email'));

    if ($response === Password::RESET_LINK_SENT) {
        $user = \App\Models\User::where('email', $request->email)->first();

        if ($user) {
            $token = app('auth.password.broker')->createToken($user);

            $data = [
                'name' => $user->name,
                'reset_link' => url('/api/resetpassword/' . $token . '/' . urlencode($user->email)),
            ];

            Mail::to($user->email)->send(new \App\Mail\ResetPasswordMail($data));
        }

        return response()->json(['message' => 'Reset password link sent to your email.'], 200);
    }

    return response()->json(['error' => 'Unable to send reset link.'], 500);
}

    public function resetPassword(Request $request)
{
   // Validate the request
    $validator = Validator::make($request->all(), [
        'token' => 'required',
        'password' => 'required|confirmed|min:8', // minimum password length
        'password_confirmation' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Find the user by email using the token
   $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user) use ($request) {
            $user->password = Hash::make($request->password);
            $user->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['status' => 'Mật khẩu đã được reset thành công!'])
        : response()->json(['errors' => ['email' => 'Có lỗi xảy ra.']], 500);
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($identifier)
    {
        User::where('id', $identifier)->delete();
        $data = $this->model::with('roles')->get();
        return response()->json(['check' => true, 'data' => $data], 200);
    }
}
