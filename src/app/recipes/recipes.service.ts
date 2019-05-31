import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<Recipe[]>();

  constructor(private http: HttpClient) {}

  getRecipes() {
    this.http
      .get<{ message: string, recipes: any }>(
        'http://localhost:3000/api/recipes'
      )
      .pipe(map((recipeData) => {
        return recipeData.recipes.map(recipe => {
          return {
            recipeName: recipe.recipeName,
            content: recipe.content,
            id: recipe._id
          };
        });
      }))
      .subscribe(transformedRecipes => {
        this.recipes = transformedRecipes;
        this.recipesUpdated.next([...this.recipes]);
      });
  }

  getRecipeUpdateListener() {
    return this.recipesUpdated.asObservable();
  }

  getRecipe(id: string) {
    return this.http.get<{ _id: string, recipeName: string, content: string }>(
      'http://localhost:3000/api/recipes/' + id
    );
  }

  addRecipe(recipeName: string, content: string) {
    const recipe: Recipe = {id: null, recipeName: recipeName, content: content};
    this.http.post<{ message: string, recipeId: string }>('http://localhost:3000/api/recipes', recipe)
      .subscribe((responseData) => {
        const id = responseData.recipeId;
        recipe.id = id;
        this.recipes.push(recipe);
        this.recipesUpdated.next([...this.recipes]);
    });
  }

  updateRecipe(id: string, recipeName: string, content: string) {
    const recipe: Recipe = { id: id, recipeName: recipeName, content: content };
    this.http.put('http://localhost:3000/api/recipes/' + id, recipe)
      .subscribe(response => {
        const updatedRecipes = [...this.recipes];
        const oldRecipeIndex = updatedRecipes.findIndex(r => r.id === recipe.id);
        updatedRecipes[oldRecipeIndex] = recipe;
        this.recipes = updatedRecipes;
        this.recipesUpdated.next([...this.recipes]);
        console.log(response);
      });
  }

  deleteRecipe(recipeId: string) {
    this.http.delete('http://localhost:3000/api/recipes/' + recipeId)
      .subscribe(() => {
        const updatedRecipes = this.recipes.filter(recipe => recipe.id !== recipeId);
        this.recipes = updatedRecipes;
        this.recipesUpdated.next([...this.recipes]);
      });
  }
}
