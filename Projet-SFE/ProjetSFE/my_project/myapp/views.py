from .serializers import UserSerializer,ProjectSerializer,ProjectUserSerializer,ReunionSerializer,ProgrammeSerializer,PartenaireSerializer,ParticipationSerializer,ProjetListSerializer,PartenaireListSerializer,ListParticipationSerializer,ParticipationByProjAndProg
from .models import User,Projet,Reunion,Programme,Partenaire,Participation
from rest_framework import viewsets,permissions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from rest_framework.views import APIView
from datetime import datetime
import math
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.db.models import Sum
from django.db.models import Max, Min
from django.db.models import Avg
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.db.models import Count



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['division'] = user.division
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer

    def create(self, request, *args, **kwargs):
     try:
        # Encrypt the password before saving
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
     except IntegrityError as e:
        if e.args[0] == "UNIQUE constraint failed: auth_user.email":
            return Response({'message': 'Cette adresse email est déjà utilisée.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': "Cette adresse email est déjà utilisée"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Vérifier si l'adresse e-mail a été modifiée
        if 'email' in request.data and request.data['email'] != instance.email:
            # Vérifier si l'adresse e-mail est déjà utilisée par un autre utilisateur
            if User.objects.filter(email=request.data['email']).exists():
                raise ValidationError("Cette adresse e-mail est déjà utilisée.")

        if 'password' in request.data:
            request.data['password'] = make_password(request.data['password'])

        self.perform_update(serializer)

        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def employe_users(self, request):
        employe_users = User.objects.filter(role=User.Role.EMPLOYE)
        serialized_users = UserSerializer(employe_users, many=True)
        return Response(serialized_users.data)
    

    @action(detail=True, methods=['get'])
    def program_and_project_counts(self, request, pk=None):
        user = self.get_object()
        program_count = Programme.objects.filter(users=user).count()
        project_count = Projet.objects.filter(programme__users=user).count()
        data = {
            'program_count': program_count,
            'project_count': project_count
        }
        return Response(data)
    
    @action(detail=True, methods=['get'])
    def projects(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        projects = Projet.objects.filter(programme__users=user)
        project_data = []
        for project in projects:
            project_data.append({
                'id': project.id,
                'intitule_projet': project.intitule_projet,
                'localisation': project.localisation,
                'date_fin_reel': project.date_fin_reel,
                'budget_global': project.budget_global,
                'statue_projet': project.statue_projet,
                'taux_davancement': project.taux_davancement,
                # Add more project fields as needed
            })

        return Response(project_data)



class StatisticsViewSet(viewsets.ViewSet):

    def list(self, request):
        # Count the number of users, programs, projects, and partners
        user_count = User.objects.count()
        program_count = Programme.objects.count()
        project_count = Projet.objects.count()
        partner_count = Partenaire.objects.count()
        data = {
            'user_count': user_count,
            'program_count': program_count,
            'project_count': project_count,
            'partner_count': partner_count,
        }

        return Response(data)


    def role_distribution(self, request):
        # Get the distribution of users based on their roles
        role_distribution = User.objects.values('role').annotate(count=Count('role'))

        # Create a dictionary to store the role distribution
        role_distribution_dict = {role['role']: role['count'] for role in role_distribution}

        return Response(role_distribution_dict)
    
    @action(detail=False, methods=['get'])
    def user_distribution_by_division(self, request):
        # Get all divisions
        all_divisions = dict(User.DIVISION_CHOICES)

        # Get the distribution of users based on their division
        division_distribution = User.objects.values('division').annotate(count=Count('division'))

        # Create a dictionary to store the division distribution
        division_distribution_dict = {division: 0 for division in all_divisions}

        # Update the division distribution with the actual counts
        for division_data in division_distribution:
            division = division_data['division']
            count = division_data['count']
            division_distribution_dict[division] = count

        # Convert division codes to their corresponding labels
        division_distribution_dict = {
            all_divisions[division]: count for division, count in division_distribution_dict.items()
        }
        return Response(division_distribution_dict)
    

class ProgrammeViewSet(viewsets.ModelViewSet):
    queryset = Programme.objects.all()
    serializer_class = ProgrammeSerializer


    @action(detail=False, methods=['get'])
    def count_projectsforSpecificProgramme(self, request):
        program_id = request.query_params.get('program_id') 
        try:
            program = Programme.objects.get(id=program_id)
            projects = Projet.objects.filter(programme=program)
            count_all = projects.count()
            count_planifie = projects.filter(statue_projet='Planifié').count()
            count_en_cours_demarrage = projects.filter(statue_projet='En cours de démarrage').count()
            count_en_cours_realisation = projects.filter(statue_projet='En cours de réalisation').count()
            count_achevee = projects.filter(statue_projet='Achevée').count()
            response_data = {
                'count_all': count_all,
                'count_planifie': count_planifie,
                'count_en_cours_demarrage': count_en_cours_demarrage,
                'count_en_cours_realisation': count_en_cours_realisation,
                'count_achevee': count_achevee,
            }

            return Response(response_data)
        except Programme.DoesNotExist:
            return Response({'error': 'Program not found'}, status=status.HTTP_404_NOT_FOUND)




    @action(detail=False, methods=['get'])
    def count_projectsforAllProgramme(self, request):
        programs = Programme.objects.all()
        projects = Projet.objects.filter(programme__in=programs)

        count_all = projects.count()
        count_planifie = projects.filter(statue_projet='Planifié').count()
        count_en_cours_demarrage = projects.filter(statue_projet='En cours de démarrage').count()
        count_en_cours_realisation = projects.filter(statue_projet='En cours de réalisation').count()
        count_achevee = projects.filter(statue_projet='Achevée').count()

        response_data = {
            'count_all': count_all,
            'count_planifie': count_planifie,
            'count_en_cours_demarrage': count_en_cours_demarrage,
            'count_en_cours_realisation': count_en_cours_realisation,
            'count_achevee': count_achevee,
        }

        return Response(response_data)
    

    @action(detail=False, methods=['get'])
    def count_statusProjet_for_all_programsUser(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id parameter is required.'}, status=400)

        user = User.objects.get(id=user_id)
        programs = Programme.objects.filter(users=user)
        projects = Projet.objects.filter(programme__in=programs)

        count_all = projects.count()
        count_planifie = projects.filter(statue_projet='Planifié').count()
        count_en_cours_demarrage = projects.filter(statue_projet='En cours de démarrage').count()
        count_en_cours_realisation = projects.filter(statue_projet='En cours de réalisation').count()
        count_achevee = projects.filter(statue_projet='Achevée').count()

        response_data = {
            'count_all': count_all,
            'count_planifie': count_planifie,
            'count_en_cours_demarrage': count_en_cours_demarrage,
            'count_en_cours_realisation': count_en_cours_realisation,
            'count_achevee': count_achevee,
        }

        return Response(response_data)



    def count_projectsforOneProgramme(self, request, pk=None):
        programme = self.get_object()
        projects = Projet.objects.filter(programme=programme)
        count_all = projects.count()
        count_planifie = projects.filter(statue_projet='Planifié').count()
        count_en_cours_demarrage = projects.filter(statue_projet='En cours de démarrage').count()
        count_en_cours_realisation = projects.filter(statue_projet='En cours de réalisation').count()
        count_achevee = projects.filter(statue_projet='Achevée').count()
        response_data = {
            'count_all': count_all,
            'count_planifie': count_planifie,
            'count_en_cours_demarrage': count_en_cours_demarrage,
            'count_en_cours_realisation': count_en_cours_realisation,
            'count_achevee': count_achevee,
        }
        return Response(response_data)
    

    @action(detail=True, methods=['get'])
    def calculate_moyenne_taux_avancement(self, request, pk=None):
        programme = self.get_object()
        projet_list = Projet.objects.filter     (programme=programme)
        if not projet_list:
            response_data = {'moyenne_taux_avancement': 0}
            return Response(response_data)
        else:
            total_progress = sum([projet.taux_davancement for projet in projet_list])
            moyenne = total_progress / len(projet_list)
            moyenne = round(moyenne, 2)
            response_data = {
               'moyenne_taux_avancement': moyenne
            }
            return Response(response_data)
    

    @action(detail=True, methods=['get'])
    def getProgrammeByUserId(self, request, user_id=None):
        user_programs = Programme.objects.filter(users__id=user_id)
        serializer = ProgrammeSerializer(user_programs, many=True)
        return Response(serializer.data)
    

    @action(detail=False, methods=['get'])
    def contributions(self, request):
        programs = self.get_queryset()
        contributions = {}

        for program in programs:
            projects = program.projet_set.all()
            program_contributions = {}

            for project in projects:
                participations = project.participation_set.all()
                for participation in participations:
                    partner = participation.partenaire
                    contribution = participation.contribution

                    partner_str = str(partner)  # Convert Partenaire object to a string

                    if partner_str in program_contributions:
                        program_contributions[partner_str] += contribution
                    else:
                        program_contributions[partner_str] = contribution

            contributions[program.intitule_programme] = program_contributions

        return Response(contributions)
    


    @action(detail=False, methods=['get'])
    def sector_percentages(self, request):
        programs = self.get_queryset()
        sector_counts = {}

        total_projects = 0  # Initialize total projects count

        for program in programs:
            projects = program.projet_set.all()
            total_projects += projects.count()  # Increment total projects count

            for project in projects:
                sector = project.secteur
                if sector in sector_counts:
                    sector_counts[sector] += 1
                else:
                    sector_counts[sector] = 1

        total_programs = programs.count()
        sector_percentages = {}
        for sector, count in sector_counts.items():
            percentage = (count / total_projects) * 100
            sector_percentages[sector] = round(percentage, 2)
        return Response(sector_percentages)
    

    @action(detail=False, methods=['get'])
    def sector_percentagesByUser(self, request, user_id=None):
        user = User.objects.get(pk=user_id)  # Get the user based on the provided ID
        programs = Programme.objects.filter(users=user)  # Retrieve programs for the specific user
        sector_counts = {}

        total_projects = 0  # Initialize total projects count

        for program in programs:
            projects = program.projet_set.all()
            total_projects += projects.count()  # Increment total projects count

            for project in projects:
                sector = project.secteur
                if sector in sector_counts:
                    sector_counts[sector] += 1
                else:
                    sector_counts[sector] = 1

        total_programs = programs.count()
        sector_percentages = {}
        for sector, count in sector_counts.items():
            percentage = (count / total_projects) * 100
            sector_percentages[sector] = round(percentage, 2)
        return Response(sector_percentages)

   


    @action(detail=True, methods=['get'])
    def project_statuses(self, request, pk=None):
        program = self.get_object()
        projects = program.projet_set.all()
        status_counts = projects.values('statue_projet').annotate(count=models.Count('id'))
        status_data = {status['statue_projet']: status['count'] for status in status_counts}
        return Response(status_data)
    
    
    @action(detail=False, methods=['get'])
    def programmes_with_budget_global(self, request):
        programs = self.get_queryset()
        data = []

        for program in programs:
            projet_data = []

            for projet in program.projet_set.all():
                projet_data.append({
                    'id': projet.id,
                    'intitule_projet': projet.intitule_projet,
                    'budget_global': projet.budget_global,
                })

            program_data = {
                'id': program.id,
                'intitule_programme': program.intitule_programme,
                'projects': projet_data,
            }

            data.append(program_data)

        return Response(data)
    
    @action(detail=False, methods=['get'])
    def get_budget_stats(self, request):
        # Dictionary to store the maximum and minimum budget per program
        budget_stats = {}

        programs = self.get_queryset()

        for program in programs:
            program_id = program.id
            program_name = program.intitule_programme
            projects = Projet.objects.filter(programme=program)

            if projects.exists():
                # Find the maximum and minimum budget within the projects
                max_budget = projects.aggregate(Max('budget_global'))['budget_global__max']
                min_budget = projects.aggregate(Min('budget_global'))['budget_global__min']

                # Handle None values
                max_budget = max_budget or 0
                min_budget = min_budget or 0
            else:
                # Default values if no projects exist
                max_budget = 0
                min_budget = 0

            budget_stats[program_id] = {
                'intitule_programme': program_name,
                'max_budget': max_budget,
                'min_budget': min_budget
            }

        return Response(budget_stats)
    

    @action(detail=True, methods=["GET"])
    def partner_contribution_projet(self, request, pk=None):
        programme = self.get_object()
        project_id = request.query_params.get("project_id")
        if not project_id:
            return Response({"error": "project_id parameter is required."}, status=400)
        try:
            project = programme.projet_set.get(id=project_id)
        except Projet.DoesNotExist:
            return Response({"error": "Project not found."}, status=404)
        partner_contributions = project.participation_set.values("partenaire__nom").annotate(
            total_contribution=Sum("contribution")
        )
        contribution_data = {
            "project_id": project.id,
            "project_name": project.intitule_projet,
            "partner_contributions": partner_contributions,
        }
        return Response(contribution_data)
    

    @action(detail=True, methods=['get'])
    def partner_contribution_programme(self, request, pk=None):
        programme = self.get_object()
        
        participations = Participation.objects.filter(projet__programme=programme).select_related('partenaire')
        contribution_data = participations.values('partenaire__nom').annotate(contribution=Sum('contribution'))
        
        return Response(contribution_data)
    
    @action(detail=False, methods=['get'])
    def get_programmes_with_tauxavancement(self, request):
        programmes = Programme.objects.all()
        data = []

        for programme in programmes:
            taux_davancement = programme.projet_set.aggregate(avg_taux_davancement=Avg('taux_davancement'))['avg_taux_davancement']
            data.append({
                'id': programme.id,
                'intitule_programme': programme.intitule_programme,
                'taux_davancement': taux_davancement or 0,  # Handle the case when taux_davancement is None
            })

        return Response(data)
    
    @action(detail=False, methods=['get'])
    def completed_programs(self, request):
        # Get all users
        users = User.objects.all()

        # Create a dictionary to store user's completed programs
        user_completed_programs = {}

        # Iterate over each user
        for user in users:
            # Get the completed programs for the user
            completed_programs = Programme.objects.filter(users=user, projet__statue_projet='Achevée')

            # Add the completed programs to the dictionary
            user_completed_programs[user.username] = completed_programs

        # Return the user's completed programs
        return Response(user_completed_programs)
    

    @action(detail=False, methods=['get'])
    def statusProjetForAllProgramme(self, request):
        programs = self.get_queryset()
        status_choices = dict(Projet.STATUS_PROJET)
        status_counts = {status: 0 for status in status_choices}

        for program in programs:
            projects = Projet.objects.filter(programme=program)
            for project in projects:
                status = project.statue_projet
                if status in status_choices:
                    status_counts[status] += 1

        return Response(status_counts)
    
    
    @action(detail=False, methods=['get'])
    def get_programmes_with_nombre_projet(self, request):
        programmes = self.get_queryset().values('id', 'intitule_programme', 'nombre_projets')
        return Response(programmes)
    





    # @action(detail=False, methods=['get'])
    # def programme_intitules(self, request):
    #     programmes = Programme.objects.order_by('intitule_programme').values_list('intitule_programme', flat=True).distinct()
    #     intitules = list(programmes)
    #     return Response(intitules)
   



class ProjetViewSet(viewsets.ModelViewSet):
    queryset=Projet.objects.all()
    serializer_class=ProjectSerializer

    
    @action(detail=True, methods=['get'])
    def programme_projects(self, request, pk=None):
        programme = Programme.objects.get(pk=pk)
        projects = Projet.objects.filter(programme=programme)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def newly_created_projets(self, request):
        # Retrieve the projects created within the last 24 hours
        last_24_hours = timezone.now() - timezone.timedelta(hours=24)
        projects = Projet.objects.filter(date_created__gte=last_24_hours)

        project_count = projects.count()

        return Response({'count_new_projet': project_count})
    
 



class ProjectProgrammeDataView(APIView):
    def get(self, request, project_id):
        try:
            project = Projet.objects.get(id=project_id)
            project_serializer = ProjectSerializer(project)
            program_serializer = ProgrammeSerializer(project.programme)

            participations = Participation.objects.filter(projet=project)
            
            partner_data = []
            for participation in participations:
                partner = participation.partenaire
                partner_serializer = PartenaireSerializer(partner)
                contribution = participation.contribution
                partner_data.append({
                    **partner_serializer.data,
                    'contribution': contribution
                })
            project_data = project_serializer.data
            project_start_date = None
            project_end_date = None

            if 'date_debut_reel' in project_data and project_data['date_debut_reel']:
                project_start_date = datetime.strptime(project_data['date_debut_reel'], '%Y-%m-%d')
            if 'date_fin_reel' in project_data and project_data['date_fin_reel']:
                project_end_date = datetime.strptime(project_data['date_fin_reel'], '%Y-%m-%d')

         # Perform the duration calculation
            if project_start_date and project_end_date:
                 start_year = project_start_date.year
                 start_month = project_start_date.month
                 end_year = project_end_date.year
                 end_month = project_end_date.month
                 dalai = (end_year - start_year) * 12 + (end_month - start_month)
                 dalai = math.ceil(dalai)
            else:
                  dalai = 0

            data = {
             **project_serializer.data,
             **program_serializer.data,
             'partners': partner_data,
             'dalai': dalai,
            }
            return Response(data)

        except Projet.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)


class PartenaireViewSet(viewsets.ModelViewSet):
    queryset = Partenaire.objects.all()
    serializer_class = PartenaireSerializer

    @action(detail=True)
    def projets(self, request, pk=None):
        partenaire = self.get_object()
        serializer = ParticipationSerializer(partenaire.participation_set.all(), many=True)
        return Response(serializer.data)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    


   


class ParticipationViewSet(viewsets.ModelViewSet):
    queryset = Participation.objects.all()
    serializer_class = ParticipationSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            projet_id = serializer.validated_data.get('projet').id
            partenaire_id = serializer.validated_data.get('partenaire').id
            projet = Projet.objects.get(pk=projet_id)
            partenaire = Partenaire.objects.get(pk=partenaire_id)
            if Participation.objects.filter(projet=projet, partenaire=partenaire).exists():
                return Response({'message': 'This combination of Partenaire and Projet already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        
            participation = Participation(
            projet=projet,
            partenaire=partenaire,
            contribution=serializer.validated_data.get('contribution')
        )
            participation.save()
            return Response(self.get_serializer(participation).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def list(self, request):
        participations = self.get_queryset()
        serializer = ListParticipationSerializer(participations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'])
    def contributions_by_project(self, request):
        program_id = request.query_params.get('program_id')
        project_id = request.query_params.get('project_id')

        if not program_id or not project_id:
            return Response({'error': 'Both program_id and project_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

        participations = Participation.objects.filter(
            projet__programme_id=program_id,
            projet_id=project_id
        )
        serializer = ParticipationByProjAndProg(participations, many=True)
        return Response(serializer.data)




class ProjetListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProjetListSerializer

    def get_queryset(self):
        programme_id = self.kwargs.get('programmeId')
        programme = get_object_or_404(Programme, id=programme_id)
        return Projet.objects.filter(programme=programme).values('id', 'intitule_projet')



class PartenaireListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Partenaire.objects.all().values('id', 'nom')
    serializer_class = PartenaireSerializer



class ReunionViewSet(viewsets.ModelViewSet):
    queryset = Reunion.objects.all()
    serializer_class = ReunionSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        reunions = Reunion.objects.filter(user=user_id)
        return reunions
    
    @action(detail=True, methods=['delete'])
    def delete_for_user(self, request, user_id=None, pk=None):
        try:
            reunion = self.get_queryset().get(pk=pk, user=user_id)
        except Reunion.DoesNotExist:
            return Response({'detail': 'Reunion not found'}, status=404)
        reunion.delete()
        return Response({'detail': 'Reunion deleted'}, status=204)
    
    @action(detail=False, methods=['get'], url_path='count_for_user/(?P<user_id>\d+)')
    def count_for_user(self, request, user_id=None):
        if user_id is not None:
            reunion_count = self.get_queryset().count()
            return Response({'count_nbr_reunion': reunion_count})
        return Response({'detail': 'Invalid request'}, status=400)
    
    @action(detail=False, methods=['get'])
    def upcoming_reunions(self, request):
        user_id = request.GET.get('user_id')  # Assuming the user ID is provided as a query parameter
        if user_id:
            # Filter reunions for the specific user that are not taking place yet
            upcoming_reunions = Reunion.objects.filter(user_id=user_id, start__gt=datetime.now())
        else:
            # If no user ID is provided, return an empty queryset
            upcoming_reunions = Reunion.objects.none()

        # Serialize the reunions and return the response
        serializer = self.get_serializer(upcoming_reunions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['put'])
    def update_reunion(self, request, user_id=None, pk=None):
        try:
            reunion = self.get_queryset().get(pk=pk, user=user_id)
        except Reunion.DoesNotExist:
            return Response({'detail': 'Reunion not found'}, status=status.HTTP_404_NOT_FOUND)
        
        reunion.title = request.data.get('title', reunion.title)
        
        start = request.data.get('start', reunion.start)
        reunion.start = datetime.strptime(start, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        
        end = request.data.get('end', reunion.end)
        reunion.end = datetime.strptime(end, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        
        reunion.description = request.data.get('description', reunion.description)
        reunion.save()
        
        serializer = self.get_serializer(reunion)
        return Response(serializer.data, status=status.HTTP_200_OK)