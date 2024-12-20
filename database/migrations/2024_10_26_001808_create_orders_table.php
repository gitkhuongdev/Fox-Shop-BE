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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade'); 
            $table->foreignId('id_payment')->constrained('payment')->onDelete('cascade');
            $table->foreignId('id_vouchers')->nullable()->constrained('vouchers')->onDelete('set null');
            $table->string('address');
            $table->string('status');
            $table->dateTime('order_date');
            $table->text('order_note')->nullable();
            $table->decimal('total_order', 10, 0);
            $table->decimal('total_amount', 10, 0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
