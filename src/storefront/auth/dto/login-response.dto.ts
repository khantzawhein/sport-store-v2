export class LoginResponseDto {
  token: string;
  customer: CustomerDto;
}

export class CustomerDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}
