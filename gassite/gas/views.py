import json

from django.shortcuts import render
from rest_framework import mixins, generics
from rest_framework.response import Response
from rest_framework.views import APIView
import folium

from .models import Transmitter, Measurement
from .serializers import MeasurementSerializer
from .utils import get_date


def index(request):
    """Entry point with template for Vue and map SSR"""
    DEFAULT_MAP_ZOOM = 17

    transmitters = Transmitter.objects.all()

    map = folium.Map(location=[transmitters[0].lat, transmitters[0].long], zoom_start=DEFAULT_MAP_ZOOM)
    for transmitter in transmitters:
        coordinates = (transmitter.lat, transmitter.long)
        folium.Marker(coordinates, popup=transmitter.name).add_to(map)

    context = {
        'map': map._repr_html_()
    }
    return render(request, 'gas/index.html', context=context)


def sim_data(request):
    """View to save new measurement to db"""
    # Transmitters send get query
    if (request.GET):
        Measurement.objects.create(transmitter=request.GET.get('tr'),
                                   ps=request.GET.get('ps'),
                                   tco2=request.GET.get('tco2'),
                                   co2=request.GET.get('co2'),
                                   tch4=request.GET.get('tch4'),
                                   ch4=request.GET.get('ch4'),
                                   )


class MeasurementList(mixins.ListModelMixin, generics.GenericAPIView):
    """Measurement list with reverse ordering for last day"""
    queryset = Measurement.objects.filter(time_create__gte=get_date()).order_by('-pk')
    serializer_class = MeasurementSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class NewMeasurementList(APIView):
    """New measurements with pk greater than query last_msr value"""

    def get_object(self, pk):
        res = Measurement.objects.filter(pk__gt=pk).order_by('-pk')
        return res

    def post(self, request):
        pk = json.loads(request.body)['last_msr']
        measurements = self.get_object(pk)
        serializer = MeasurementSerializer(measurements, many=True)
        return Response(serializer.data)
