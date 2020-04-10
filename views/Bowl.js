//DO NOT DELETE
class Bowl {
  constructor(x, y, r, img, name) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.foodImg = img;
    this.foodName = name;
    this.hasBeenAdded = false;

  }

  clicked(userIngredients) {
    //if the latestData is S1/S2/S3/S4, select different bowl in the corresponding positions 

    if (!this.hasBeenAdded) {
      // if the ingredient has not been added, add it / add the name to it 
      userIngredients.push({
        name: this.foodName,
        img: this.foodImg
      });
      console.log('this.foodName:' + this.foodName);
      this.hasBeenAdded = true;
    }
  }

  show() {
    //show images of ingredients that are not added - how to reset? 
    if (!this.hasBeenAdded) {
      image(this.foodImg, this.x, this.y, this.r, this.r);
    }

  }
}