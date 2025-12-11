from rest_framework import viewsets, mixins


# Example: reusable ListCreate viewset
class ListCreateViewSet(mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        viewsets.GenericViewSet):
    """
    Reusable List + Create API ViewSet
    """
    pass
