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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->string('code')->unique(); // Mã voucher (unique)
            $table->enum('discount_type', ['percentage', 'fixed']); // Kiểu giảm giá (phần trăm hoặc cố định)
            $table->decimal('discount_value', 10, 0); // Giá trị giảm giá
            $table->dateTime('start_date'); // Ngày bắt đầu
            $table->dateTime('end_date'); // Ngày kết thúc
            $table->integer('usage_limit')->nullable(); // Giới hạn sử dụng (có thể null)
            $table->decimal('minimum_monney', 10, 0)->nullable(); // Số tiền tối thiểu để sử dụng voucher
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
