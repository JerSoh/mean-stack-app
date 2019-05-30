import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<Recipe[]>();

  constructor(private http: HttpClient) {}

  getRecipes() {
    this.http.get<{message: string, recipes: Recipe[]}>('http://localhost:3000/api/recipes')
      .subscribe((recipeData) => {
        this.recipes = recipeData.recipes;
        this.recipesUpdated.next([...this.recipes]);
      });
  }

  getRecipeUpdateListener() {
    return this.recipesUpdated.asObservable();
  }

  addRecipe(recipeName: string, content: string) {
    const recipe: Recipe = {id: null, recipeName: recipeName, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/recipes', recipe)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.recipes.push(recipe);
        this.recipesUpdated.next([...this.recipes]);
    });

  }
}
