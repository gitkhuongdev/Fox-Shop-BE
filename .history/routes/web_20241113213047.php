<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardControler;
Route::get('/',[UserController::class, 'loginForm']);
Route::prefix('admin')->group(function () {
Route::resource('/roles', RolesController::class);
Route::resource('/permissions', PermissionController::class);
Route::resource('/users', UserController::class);
Route::resource('/categories', CategoriesController::class);
Route::resource('/brands', BrandController::class);
Route::resource('/products', ProductController::class);
Route::post('categories/imgaes/{id}', [CategoriesController::class, 'updateCate']);
Route::post('post/update/{id}', [PostController::class, 'updatePost']);
Route::put('/products/switch/{id}', [ProductController::class, 'switchProduct']);
Route::delete('/products/drop-image/{id}/{imageName}', [ProductController::class, 'removeImage']);
Route::post('/products/set-image/{id}/{imageName}', [ProductController::class, 'setImage']);
Route::post('/products/set-image/{id}/{imageName}', [ProductController::class, 'setImage']);
Route::post('/products/upload-images/{id}', [ProductController::class, 'UploadImages']);
Route::resource('/attributes', AttributeController::class);
Route::resource('/posts', PostController::class);
Route::resource('/cart',CartController::class);
Route::resource('/dashboard', DashboardControler::class);
Route::get('/products/detail/{slug}', [ProductController::class, 'ProDetail']);
});

