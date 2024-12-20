<?php

namespace App\Http\Controllers;
use App\Models\Review;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function __construct(Review $model)
    {
        $this->model = Review::class;
    }

    public function index()
    {
        $review = Review::all();
        return Inertia::render("Reviews/Index");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_product' => 'required|exists:products,id',
            'id_user' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        Review::create($validated);

        return response()->json(['check' => true]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // 
    public function getAllComments(Request $request){
        $comments = Review::all();
        return response()->json($comments);
    }
}
