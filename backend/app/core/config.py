import json
from typing import List, Union
from pydantic import AnyHttpUrl, BeforeValidator, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Annotated

def parse_cors_origins(v: Union[str, List[str]]) -> List[str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, (list, str)):
        try:
            return json.loads(v)
        except Exception:
            return v
    return []

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="backend/.env",
        env_ignore_empty=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "NagrikSathi API"
    API_V1_STR: str = "/api/v1"
    
    # CORS setup
    BACKEND_CORS_ORIGINS: Annotated[
        List[AnyHttpUrl], BeforeValidator(parse_cors_origins)
    ] = []

    # MySQL connection configuration
    MYSQL_SERVER: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "password"
    MYSQL_DB: str = "nagriksathi_db"

    # Gemini API Key configuration
    GEMINI_API_KEY: str = ""

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_SERVER}:{self.MYSQL_PORT}/{self.MYSQL_DB}"

settings = Settings()
