<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function __construct(Post $model)
    {
        $this->model = Post::class;
    }
    public function index()
    {
        $posts = Post::all();
        return Inertia::render('Posts/Index' , ['posts' => $posts]);
    }

    public function create()
    {
        //
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'required|image|max:2048',
            'start' => 'required|date',
            'end' => 'required|date',
            'short' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data=[];
        $data['title'] = $request->title;
        $data['content'] = $request->content;
        $data['slug']=Str::slug($data['title']);
        $data['start_date'] = $request->start;
        $data['end_date'] = $request->end;
        $data['short_description'] = $request->short;
        $imagesPath=null;
        if ($request->hasFile('image')) {
        $imagesPath = $request->file('image')->store('post', 'public');
        $imagesUrl = Storage::url($imagesPath);
        $data['image'] = $imagesUrl;
        }
        $this->model::create($data);
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
    public function show($id)
    {
        $result = $this->model::find($id);
        return Inertia::render('Posts/Edit', ['post' => $result]);
    }
    public function updatePost(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'start' => 'nullable|date',
            'end' => 'nullable|date',
            'short' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['check' => false, 'msg' => $validator->errors()->first()]);
        }
        $data = [];
        $data['title'] = $request->title;
        $data['content'] = $request->content;
        $data['slug'] = Str::slug($data['title']);
        $data['start_date'] = $request->start;
        $data['end_date'] = $request->end;
        $data['short_description'] = $request->short;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('post', 'public');
            $url = Storage::url($path);
            $data['image'] = $url;
        }
        $this->model::find($id)->update($data);
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post = $this->model::find($post->id);
        if(!$post){
            return response()->json(['check'=>false,'msg'=>'Không tìm thấy bài viết']);
        }
        $post->delete();
        return response()->json(['check'=>true,'data'=>$this->model::all()]);
    }
    public function api_post(Request $request)
    {
        $post=Post::
        where('status',1)
        ->get();
        return response()->json($post);
    }
    public function api_post_detail(Request $request, slug $slug)
    {
        if(!empty($slug)){
            $post = Post::find($slug)->where('status',1)
        ;
        }
    }
}
