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
        if(Schema::hasTable("users")){
            Schema::table("users", function (Blueprint $table) { // Changed from Schema::create to Schema::table
                if(!Schema::hasColumn("users","status")){
                    $table->boolean("status")->after('email')->default(1);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
