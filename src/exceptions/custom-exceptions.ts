import {
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
    UnprocessableEntityException,
    InternalServerErrorException,
  } from '@nestjs/common';
  
  export class CustomNotFoundException extends NotFoundException {
    constructor(resource: string, query?: string) {
      super(`${resource} ${query?` with matching '${query}'` : ''}not found`);
    }
  }
  
  export class CustomBadRequestException extends BadRequestException {
    constructor(message?: string) {
      super(message || 'Bad request due to invalid data or parameters');
    }
  }
  
  export class CustomUnauthorizedException extends UnauthorizedException {
    constructor(message?: string) {
      super(message || 'Unauthorized access - please provide valid credentials');
    }
  }
  
  export class CustomForbiddenException extends ForbiddenException {
    constructor(message?: string) {
      super(message || 'Forbidden access - you do not have permission to perform this action');
    }
  }
  
  export class CustomConflictException extends ConflictException {
    constructor(resource: string, reason?: string) {
      super(`Conflict with the current state of the ${resource} - ${reason || 'conflict detected'}`);
    }
  }
  
  export class CustomUnprocessableEntityException extends UnprocessableEntityException {
    constructor(message?: string) {
      super(message || 'The server understands the content type of the request entity, but the request was unable to be processed. This may be due to semantic errors in the request.');
    }
  }
  
  export class CustomServiceException extends InternalServerErrorException {
    constructor(service: string, operation: string, message?: string) {
      super(message || `An error occurred while performing '${operation}' in the '${service}' service. Please try again later.`);
    }
  }
  
  export class CustomInternalServerErrorException extends InternalServerErrorException {
    constructor(operation: string, message?: string) {
      super(message || `An internal server error occurred while performing '${operation}'. Please contact support if the issue persists.`);
    }
  }
  