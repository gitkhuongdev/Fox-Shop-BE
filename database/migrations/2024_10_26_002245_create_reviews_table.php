<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
           $table->foreignId('id_product')->constrained('products'); // Khóa ngoại liên kết với bảng products
            $table->foreignId('id_user')->constrained('users'); // Khóa ngoại liên kết với bảng users
            $table->integer('rating'); // Đánh giá
            $table->string('status'); // Trạng thái
            $table->timestamp('review_date')->useCurrent(); // Ngày đánh giá
            $table->text('comment')->nullable(); // Nhận xét
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
