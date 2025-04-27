import joi from "joi"

const book = joi.object({
    title: joi.string().min(3).required(),
    author: joi.string().min(3).required(),
    year: joi.number(),
    genre: joi.string()

})

export const bookValidator = (data) => {
    return book.validate(data)
}


