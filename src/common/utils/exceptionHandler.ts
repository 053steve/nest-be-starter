import { InternalServerErrorException, NotFoundException } from '@nestjs/common';



export const handleExceptions = (err, message?) => {
  console.log(err);
  switch (err) {
    case 404:
      throw new NotFoundException(err);
    default:
      throw new InternalServerErrorException(err);
  }
}
