import {
  getDiscriminatorModelForClass,
  getModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';

class Buyer {
  @prop()
  public name?: string;

  @prop({ ref: () => Vehicle })
  public vehicle?: Ref<Vehicle>;
}
class Vehicle {
  @prop()
  public name?: string;
}
class Car extends Vehicle {
  @prop()
  public model?: string;
}

const BuyerModel = getModelForClass(Buyer);
const VehicleModel = getModelForClass(Vehicle);
const CarModel = getDiscriminatorModelForClass(VehicleModel, Car);

(async () => {
  await mongoose.connect('mongodb://localhost:27017/', {
    keepAlive: true,
    dbName: 'localTest',
    autoIndex: true,
  });

  const eleanor = new CarModel({ name: 'Eleanor', model: 'Shelby Mustang GT' });
  const nick = new BuyerModel({ name: 'Nicolas', vehicle: eleanor });

  await eleanor.save(); // an "as" assertion, to have types for all properties
  await nick.save();

  process.exit(0);
})();
