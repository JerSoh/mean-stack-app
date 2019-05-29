import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [];
  private recipesUpdated = new Subject<Recipe[]>();

  getRecipes() {
    return [...this.recipes];
  }

  getRecipeUpdateListener() {
    return this.recipesUpdated.asObservable();
  }

  addRecipe(recipeName: string, content: string) {
    const recipe: Recipe = {recipeName: recipeName, content: content};
    this.recipes.push(recipe);
    this.recipesUpdated.next([...this.recipes]);
  }
}
