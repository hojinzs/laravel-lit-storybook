<?php

namespace App\Http\Controllers;

use App\Http\Requests\TodoRequest;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $todos = $request->user()
            ?->todos()
            ->latest()
            ->get();

        return response()->json([
            'todos' => $todos,
        ]);
    }

    public function store(TodoRequest $request): JsonResponse
    {
        $todo = $request->user()
            ->todos()
            ->create([
                'title' => $request->string('title'),
                'completed' => $request->boolean('completed', false),
            ]);

        return response()->json([
            'todo' => $todo,
        ], 201);
    }

    public function update(TodoRequest $request, Todo $todo): JsonResponse
    {
        $this->abortIfNotOwner($request, $todo);

        $todo->update($request->validated());

        return response()->json([
            'todo' => $todo->refresh(),
        ]);
    }

    public function destroy(Request $request, Todo $todo): JsonResponse
    {
        $this->abortIfNotOwner($request, $todo);

        $todo->delete();

        return response()->json([
            'message' => 'Deleted',
        ]);
    }

    private function abortIfNotOwner(Request $request, Todo $todo): void
    {
        abort_if(
            $todo->user_id !== $request->user()?->id,
            403,
            'You are not allowed to access this todo.'
        );
    }
}
