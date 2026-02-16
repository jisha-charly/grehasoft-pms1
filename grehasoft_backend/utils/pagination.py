from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from math import ceil

class StandardResultsSetPagination(PageNumberPagination):
    """
    Default pagination for Grehasoft PMS & CRM.
    Provides total pages and current page metadata for the React frontend.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        """
        Custom response structure including enhanced metadata.
        """
        total_pages = ceil(self.page.paginator.count / self.page_size) if self.page_size else 1
        
        return Response({
            'metadata': {
                'total_records': self.page.paginator.count,
                'total_pages': total_pages,
                'current_page': self.page.number,
                'page_size': self.get_page_size(self.request),
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })

class LargeResultsSetPagination(PageNumberPagination):
    """
    Used for audit logs or large reporting tables where 
    more data per page is required.
    """
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'metadata': {
                'total_records': self.page.paginator.count,
                'current_page': self.page.number,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'results': data
        })