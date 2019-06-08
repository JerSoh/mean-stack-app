import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  recipe: Recipe;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private recipeId: string;

  constructor(
    public recipesSvc: RecipesService,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'recipeName': new FormControl(null, {
        validators: [Validators.required]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('recipeId')) {
        this.mode = 'edit';
        this.recipeId = paramMap.get('recipeId');
        this.isLoading = true;
        this.recipesSvc.getRecipe(this.recipeId).subscribe(recipeData => {
          this.isLoading = false;
          this.recipe = {
            id: recipeData._id,
            recipeName: recipeData.recipeName,
            content: recipeData.content,
            imagePath: recipeData.imagePath,
          };
          this.form.setValue({
            'recipeName': this.recipe.recipeName,
            'content': this.recipe.content,
            'image': this.recipe.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.recipeId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveRecipe() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.recipesSvc.addRecipe(
        this.form.value.recipeName,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.recipesSvc.updateRecipe(
        this.recipeId,
        this.form.value.recipeName,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

}
