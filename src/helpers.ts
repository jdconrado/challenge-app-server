import { ValidationError } from "class-validator";

function getValidationErrorConstraints(errors: ValidationError[]){
    return errors.map((el: ValidationError)=> {
        return {
            property: el.property,
            constraints: el.constraints
        };
    });
}

export {
    getValidationErrorConstraints
};