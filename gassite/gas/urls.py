from django.urls import path
from .views import *

urlpatterns = [
    path('', index),
    path('api/sim/', sim_data),
    path('api/get_measurements/', MeasurementList.as_view()),
    path('api/get_new_measurements/', NewMeasurementList.as_view()),
]
