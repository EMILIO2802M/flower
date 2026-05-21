from django.contrib import admin
from django.urls import path

from romance.views import home, tulipan


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home, name="home"),
    path("tulipan/", tulipan, name="tulipan"),
]