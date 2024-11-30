import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { differenceInMonths } from 'date-fns';

export function MinDateDifference(
  property: string,
  months: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: MinDateDifference.name,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, months],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, minMonths] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) {
            return true; // skip validation if any of the dates is missing
          }

          const diffInMonths = differenceInMonths(
            new Date(value),
            new Date(relatedValue),
          );
          return Math.abs(diffInMonths) >= minMonths;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, minMonths] = args.constraints;
          return `$property should be at least ${minMonths} month(s) apart from ${relatedPropertyName}`;
        },
      },
    });
  };
}
