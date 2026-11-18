from sqlmodel import SQLModel, Field


class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: int | None = Field(
        default=None,
        primary_key=True
    )

    name: str = Field(index=True)
    description: str = ""
    price: float
    stock: int
    category: str = Field(index=True)
    image_url: str | None = None