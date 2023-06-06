from rest_framework import serializers
from .models import User,Projet,Reunion,Programme,Partenaire,Participation
from django.core.validators import MinValueValidator,MaxValueValidator
from django.contrib.auth.hashers import make_password




class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'role', 'division', 'service', 'is_active']



class ProjectSerializer(serializers.ModelSerializer):
    intitule_projet=serializers.CharField(required=True)
    date_debut_previsionnelle=serializers.DateField(required=True)
    date_fin_previsionnelle=serializers.DateField(required=True)
    budget_global=serializers.IntegerField(validators=[MinValueValidator(0)],required=True)
    moa=serializers.CharField(required=True)
    statue_etude=serializers.CharField(required=True)
    statue_projet=serializers.CharField(required=True)
    programme = serializers.PrimaryKeyRelatedField(queryset=Programme.objects.all(), required=True)
    class Meta:
        model = Projet
        fields = '__all__'




class ParticipationSerializer(serializers.ModelSerializer):
    projet = serializers.PrimaryKeyRelatedField(queryset=Projet.objects.all())
    partenaire = serializers.PrimaryKeyRelatedField(queryset=Partenaire.objects.all())
    contribution = serializers.DecimalField(max_digits=19, decimal_places=2)

    class Meta:
        model = Participation
        fields = [ 'id','projet','partenaire', 'contribution']
        read_only_fields = ('id',)


class PartenaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partenaire
        fields = ('id', 'nom')



class ParticipationByProjAndProg(serializers.ModelSerializer):
    projet = ProjectSerializer()
    partenaire = PartenaireSerializer()
    contribution = serializers.DecimalField(max_digits=19, decimal_places=2)
    class Meta:
        model = Participation
        fields = ['id', 'projet', 'partenaire', 'contribution']
        read_only_fields = ('id',)



class ListParticipationSerializer(serializers.ModelSerializer):
    projet = serializers.CharField(source='projet.intitule_projet')
    partenaire = serializers.CharField(source='partenaire.nom')
    contribution = serializers.DecimalField(max_digits=19, decimal_places=2)

    class Meta:
        model = Participation
        fields = ['id', 'projet', 'partenaire', 'contribution']
        read_only_fields = ('id',)






class ProgrammeSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, read_only=True)
    class Meta:
        model = Programme
        fields = '__all__'



class ProjectUserSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='projet.id')
    intitule_projet = serializers.CharField(source='projet.intitule_projet')
    localisation = serializers.CharField(source='projet.localisation')
    date_debut_previsionnelle = serializers.DateField(source='projet.date_debut_previsionnelle')
    date_fin_previsionnelle = serializers.DateField(source='projet.date_fin_previsionnelle')
    budget_global = serializers.IntegerField(validators=[MinValueValidator(0)],source='projet.budget_global')
    moa = serializers.CharField(source='projet.moa')
    moad = serializers.CharField(source='projet.moad')
    date_debut_reel = serializers.DateField(source='projet.date_debut_reel')
    date_fin_reel = serializers.DateField(source='projet.date_fin_reel')
    statue_etude = serializers.CharField(source='projet.statue_etude')
    statue_projet = serializers.CharField(source='projet.statue_projet')
    engagemet = serializers.IntegerField(validators=[MinValueValidator(0)],source='projet.engagemet')
    paiement = serializers.IntegerField(validators=[MinValueValidator(0)],source='projet.paiement')
    taux_davancement = serializers.ReadOnlyField(validators=[MaxValueValidator(100),MinValueValidator(0)],source='projet.taux_davancement')
    observation = serializers.CharField(source='projet.observation')
    programme = serializers.ReadOnlyField(source='projet.programme.intitule_programme')

    class Meta:
        model = Projet
        fields = ['id', 'intitule_projet', 'localisation', 'date_debut_previsionnelle', 'date_fin_previsionnelle',
                  'budget_global', 'moa', 'moad', 'date_debut_reel', 'date_fin_reel', 'statue_etude',
                  'statue_projet', 'engagemet', 'paiement', 'taux_davancement', 'observation', 'programme']

    def get_program(self, obj):
        return obj.projet.programme.intitule_programme


class ProjetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projet
        fields = ('id', 'intitule_projet')

class PartenaireListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partenaire
        fields = ('id', 'nom')


class ReunionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reunion
        fields = '__all__'





















