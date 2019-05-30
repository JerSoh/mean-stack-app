import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipesService } from '../../recipes.service';

@Component({
  selector: 'app-recipe-list-item',
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.css']
})
export class RecipeListItemComponent implements OnInit {
  @Input() recipeItem: Recipe;

  constructor(public recipeSvc: RecipesService) { }

  ngOnInit() {
  }

  onDelete(recipeId: string) {
    this.recipeSvc.deleteRecipe(recipeId);
  }

}
