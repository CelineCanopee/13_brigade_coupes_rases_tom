from datetime import datetime
from logging import getLogger

from pydantic import EmailStr, Field, field_validator

from app.models import CLEARCUT_STATUSES, ClearCutReport
from app.schemas.base import BaseSchema
from app.schemas.clear_cut import ClearCutCreateSchema

logger = getLogger(__name__)


class PublicUserResponseSchema(BaseSchema):
    id: str
    login: str = Field(default_factory=str, json_schema_extra={"example": "JognTree78"})
    email: EmailStr = Field(
        default_factory=EmailStr, json_schema_extra={"example": "john.tree@canope.com"}
    )


class CreateClearCutsReportCreateRequestSchema(BaseSchema):
    slope_area_hectare: float | None = Field(json_schema_extra={"example": "10.0"})
    clear_cuts: list[ClearCutCreateSchema]
    city_zip_code: str = Field(
        json_schema_extra={"example": "1"},
    )


class ClearCutReportPutRequestSchema(BaseSchema):
    status: str | None = None
    user_id: int | None = None

    @field_validator("status")
    def validate_status(cls, value):
        if value is not None and value not in CLEARCUT_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(CLEARCUT_STATUSES)}")
        return value


class ClearCutReportResponseSchema(BaseSchema):
    id: str = Field(json_schema_extra={"example": "1"})

    statellite_images: list[str] | None = Field(
        json_schema_extra={"example": '["image1.jpg", "image2.jpg"]'},
    )
    slope_area_hectare: float | None = Field(
        json_schema_extra={"example": "10.0"},
    )
    status: str = Field(
        json_schema_extra={"example": "validated"},
    )
    user_id: str | None = Field(
        json_schema_extra={"example": "1"},
    )
    clear_cuts_ids: list[str] = Field(
        json_schema_extra={"example": "[1,2,3]"},
    )
    created_at: datetime = Field(
        json_schema_extra={"example": "2023-10-10T00:00:00Z"},
    )
    updated_at: datetime = Field(
        json_schema_extra={"example": "2023-10-10T00:00:00Z"},
    )
    affected_user: PublicUserResponseSchema | None = None
    assignment_requested_by_id: str | None = None


def report_to_response_schema(report: ClearCutReport, current_user: "User | None" = None) -> ClearCutReportResponseSchema:
    show_user_info = False
    if current_user is not None:
        if current_user.role == "admin" or current_user.id == report.user_id:
            show_user_info = True

    return ClearCutReportResponseSchema(
        id=str(report.id),
        affected_user=(
            None
            if report.user_id is None or not show_user_info
            else PublicUserResponseSchema(
                id=str(report.user.id),
                email=report.user.email,
                login=report.user.login,
            )
        ),
        clear_cuts_ids=[str(clearcut.id) for clearcut in report.clear_cuts],
        created_at=report.created_at,
        status=report.status,
        slope_area_hectare=report.slope_area_hectare,
        statellite_images=report.statellite_images,
        updated_at=report.updated_at,
        user_id=str(report.user_id) if (report.user_id is not None and show_user_info) else None,
        assignment_requested_by_id=str(report.assignment_requested_by_id) if report.assignment_requested_by_id else None,
    )
