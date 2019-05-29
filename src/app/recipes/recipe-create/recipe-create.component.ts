import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {

  constructor(public recipesSvc: RecipesService) { }

  ngOnInit() {
  }

  onAddRecipe(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.recipesSvc.addRecipe(form.value.recipeName, form.value.content);
    form.resetForm();
  }

}
