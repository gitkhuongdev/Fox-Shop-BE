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
        if(Schema::hasTable('users')){
            if(!Schema::hasColumn('users','idRole')){
                Schema::table('users', function (Blueprint $table) {
                    $table->unsignedBigInteger('idRole')->after('password');
                    $table->foreign(
                        'idRole',
                    )   ->references('id')  ->on('roles');
                });
            }
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
