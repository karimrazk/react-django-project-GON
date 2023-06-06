from django.urls import path,include
from .views import UserViewSet,ProjetViewSet,ReunionViewSet,ProgrammeViewSet,PartenaireViewSet,ParticipationViewSet,ProjetListViewSet,StatisticsViewSet,PartenaireListViewSet,ProjectProgrammeDataView
from rest_framework.routers import DefaultRouter
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router=DefaultRouter()
router.register('users',UserViewSet)
router.register('statistics',StatisticsViewSet, basename='statistics')
router.register('partenaires',PartenaireViewSet)
router.register('participations',ParticipationViewSet)

router.register('projets',ProjetViewSet,basename='projets')
router.register('projetlist', ProjetListViewSet, basename='projetlist')
router.register('partenairelist', PartenaireListViewSet, basename='partenairelist')

router.register('reunion',ReunionViewSet)
router.register('programmes',ProgrammeViewSet)

urlpatterns = [
    path('myApp/',include(router.urls)),
    path('myApp/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('myApp/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('myApp/programmes/sector_percentagesByUser/<int:user_id>/', ProgrammeViewSet.as_view({'get': 'sector_percentagesByUser'}), name='sector-percentages-by-user'),
    path('myApp/statistics/role_distribution/', StatisticsViewSet.as_view({'get': 'role_distribution'}), name='role-distribution'),
    path('myApp/programmes/<int:pk>/count_projectsforOneProgramme/', ProgrammeViewSet.as_view({'get': 'count_projectsforOneProgramme'}), name='programme-project-count'),
    path('myApp/reunions/<int:user_id>/', ReunionViewSet.as_view({'get': 'list'}), name='reunion-list'),
    path('myApp/reunion/<int:user_id>/<int:pk>/', ReunionViewSet.as_view({'put': 'update_reunion'}), name='update_reunion'),
    path('myApp/user/<int:user_id>/reunion/<int:pk>/', ReunionViewSet.as_view({'delete': 'destroy'}), name='user-reunion-delete'),
    path('myApp/programme/<int:pk>/prgramme_projects/', ProjetViewSet.as_view({'get': 'programme_projects'}), name='programme_projects'),
    path('myApp/programmes/user/<int:user_id>/', ProgrammeViewSet.as_view({'get': 'getProgrammeByUserId'}), name='programmes_user'),
    path('myApp/partenaire/<int:pk>/projets/', PartenaireViewSet.as_view({'get': 'projets'}), name='partenaire-projets'),
    path('myApp/participations/contributions_by_project/', ParticipationViewSet.as_view({'get': 'contributions_by_project'}), name='participation-contributions-by-project'),
    path('myApp/listOfprojetname/<int:programmeId>/', ProjetListViewSet.as_view({'get': 'list'}), name='projet-list'),
    path('myApp/project_programme_data/<int:project_id>/', ProjectProgrammeDataView.as_view()),
    path('myApp/participation/<int:pk>/', ParticipationViewSet.as_view({'delete': 'destroy'}), name='participation-delete'),
    path('myApp/listparticipations/', ParticipationViewSet.as_view({'get': 'list'}), name='listparticipations'),
]
