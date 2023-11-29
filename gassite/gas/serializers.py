from rest_framework import serializers

from gassite.gas.models import Measurement


class JsTimestampField(serializers.Field):
    def to_representation(self, value):
        return round(value.timestamp() * 1000)


class MeasurementSerializer(serializers.ModelSerializer):
    time_create = JsTimestampField()

    class Meta:
        model = Measurement
        fields = ['pk', 'transmitter', 'ps', 'tco2', 'co2', 'tch4', 'ch4', 'time_create', 'text']