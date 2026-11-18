
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from database import get_session
from models import Product
from schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

SessionDep = Annotated[Session, Depends(get_session)]


# 1. GET ALL PRODUCTS + SEARCH
@router.get("/", response_model=list[ProductResponse])
def get_products(
    session: SessionDep,
    search: str | None = None,
    category: str | None = None
):
    statement = select(Product)

    if search:
        statement = statement.where(
            Product.name.ilike(f"%{search}%")
        )

    if category:
        statement = statement.where(
            Product.category == category
        )

    statement = statement.order_by(Product.id.desc())

    return session.exec(statement).all()


# 2. GET SINGLE PRODUCT
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    session: SessionDep
):
    product = session.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# 3. CREATE PRODUCT
@router.post(
    "/",
    response_model=ProductResponse,
    status_code=201
)
def create_product(
    data: ProductCreate,
    session: SessionDep
):
    product = Product(**data.model_dump())

    session.add(product)
    session.commit()
    session.refresh(product)

    return product


# 4. UPDATE PRODUCT
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    data: ProductUpdate,
    session: SessionDep
):
    product = session.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    for key, value in data.model_dump().items():
        setattr(product, key, value)

    session.add(product)
    session.commit()
    session.refresh(product)

    return product


# 5. DELETE PRODUCT
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    session: SessionDep
):
    product = session.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    session.delete(product)
    session.commit()

    return {"message": "Product deleted successfully"}
