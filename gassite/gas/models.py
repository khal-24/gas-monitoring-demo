from django.db import models


class Transmitter(models.Model):
    name = models.TextField(blank=True)
    lat = models.FloatField(default=0)
    long = models.FloatField(default=0)


class Measurement(models.Model):
    transmitter = models.ForeignKey(Transmitter, on_delete=models.CASCADE)
    ps = models.IntegerField(default=0)
    tco2 = models.IntegerField(default=0)
    co2 = models.IntegerField(default=0)
    tch4 = models.IntegerField(default=0)
    ch4 = models.IntegerField(default=0)
    time_create = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=True)
