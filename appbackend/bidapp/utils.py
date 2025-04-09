from functools import wraps
from rest_framework.response import Response
from .models import Auction, Bid, Payment
from django.utils.timezone import now,make_aware

def role_required(required_role):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            active_role = request.headers.get('Active-role')

            if not active_role or active_role != required_role:
                return Response({'message': f'Only {required_role}s can perform this action!'}, status=403)

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator


