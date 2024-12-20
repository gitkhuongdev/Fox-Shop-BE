<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';
    protected $fillable = [
        'id_product',  
        'id_user',    
        'rating',  
        'status',  
        'review_date',
        'comment', 
    ];
    public function product()
    {
        return $this->belongsTo(Products::class, 'id_product');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
