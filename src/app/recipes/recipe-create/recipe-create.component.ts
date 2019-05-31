import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';


@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  recipe: Recipe;

  private mode ='create';
  private recipeId: string;

  constructor(
    public recipesSvc: RecipesService,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'edit';
        this.recipeId = paramMap.get('recipeId');
        this.recipesSvc.getRecipe(this.recipeId).subscribe(recipeData => {
          this.recipe = {id: recipeData._id, recipeName: recipeData.recipeName, content: recipeData.content};
        });
      } else {
        this.mode = 'create';
        this.recipeId = null;
      }
    });
  }

  onSaveRecipe(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.recipesSvc.addRecipe(form.value.recipeName, form.value.content);
    } else {
      this.recipesSvc.updateRecipe(
        this.recipeId,
        form.value.recipeName,
        form.value.content
      );
    }
    form.resetForm();
  }

}
