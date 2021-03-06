import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Subscription } from 'rxjs';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  isLoading = false;
  private recipesSub: Subscription;

  constructor(public recipesSvc: RecipesService) { }

  ngOnInit() {
    this.isLoading = true;
    this.recipesSvc.getRecipes();
    this.recipesSub = this.recipesSvc.getRecipeUpdateListener()
      .subscribe((recipes: Recipe[]) => {
        this.isLoading = false;
        this.recipes = recipes;
      });
  }

  ngOnDestroy() {
    this.recipesSub.unsubscribe();
  }

}
