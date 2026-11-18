from pydantic import BaseModel, Field, ConfigDict


class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str = ""
    price: float = Field(ge=0)
    stock: int = Field(ge=0)
    category: str = Field(min_length=1)
    image_url: str | None = None


class ProductUpdate(ProductCreate):
    pass


class ProductResponse(ProductCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)