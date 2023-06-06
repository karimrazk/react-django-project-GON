from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import UserManager
from datetime import datetime
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone


class User(AbstractUser):

    class Role(models.TextChoices):
        ADMIN="ADMIN",'Admin'
        EMPLOYE="EMPLOYE",'Employe'
        SUPERVISEUR="SUPERVISEUR",'Superviseur'
    base_role=Role.ADMIN
    
    DIVISION_CHOICES=[
        ('DRINDH','DRINDH'),
        ('DESM','DESM'),
        ('DRCT','DRCT'),
        ('DCS','DCS'),
    ]
    SERVICE_CHOICES=[
        ('SCP','SCP'),
        ('SFMSP','SFMSP'),
        ('SPC','SPC'),
        ('SSCRC','SSCRC'),
        ('SRR','SRR'),
        ('SSPP','SSPP'),
    ]
    username = None
    email = models.EmailField(unique=True)
    role=models.CharField(max_length=50,choices=Role.choices)
    division=models.CharField(max_length=9,choices=DIVISION_CHOICES,default='DCS')
    service=models.CharField(max_length=6,choices=SERVICE_CHOICES,default='SCP')
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []






class Programme(models.Model):
    users = models.ManyToManyField(User, related_name='projects')
    intitule_programme=models.CharField(max_length=900)  
    date_debut=models.DateField() 
    date_fin=models.DateField() 
    cout_global=models.DecimalField(max_digits=19, decimal_places=2) 
    nombre_projets=models.PositiveIntegerField()
    observation_programme=models.TextField(null=True)
    def __str__(self):
        return self.intitule_programme
    

    
class Projet(models.Model):
    
    STATUS_ETUDE=[
        ('Aucun','Aucun'),
        ('Planifié','Planifié'),
        ('En cours','En cours'),
        ('Achevée','Achevée'),
    ]
    STATUS_PROJET=[
        ('En cours de démarrage','En cours de démarrage'),
        ('Planifié','Planifié'),
        ('En cours de réalisation','En cours de réalisation'),
        ('Achevée','Achevée'),
    ]
    SECTEUR=[
        ('Tourisme','Tourisme'),
        ('Culture','Culture'),
        ('Sport','Sport'),
        ('Agriculture','Agriculture'),
        ('Economie sociale','Economie sociale'),
    ]

    programme=models.ForeignKey(Programme, on_delete = models.CASCADE,null=True)

    intitule_projet=models.CharField(max_length=1000,null=True) 
    localisation=models.CharField(max_length=1000) 
    date_debut_previsionnelle=models.DateField(null=True)
    date_fin_previsionnelle=models.DateField(null=True)
    budget_global=models.DecimalField(max_digits=19, decimal_places=2)
    moa=models.CharField(max_length=1000,null=True) 
    moad=models.CharField(max_length=1000,null=True) 
    date_debut_reel=models.DateField(null=True) 
    date_fin_reel =models.DateField(null=True) 
    statue_etude=models.CharField(max_length=90,choices=STATUS_ETUDE,default='Aucun')
    statue_projet=models.CharField(max_length=90,choices=STATUS_PROJET,default='En cours de démarrage')
    engagemet=models.DecimalField(max_digits=20, decimal_places=2,default=0)
    paiement=models.DecimalField(max_digits=20, decimal_places=2,default=0)
    taux_davancement=models.IntegerField(default=0,validators=[MaxValueValidator(100),MinValueValidator(0)])
    secteur=models.CharField(max_length=90,choices=SECTEUR,default='Tourisme')
    observation=models.TextField(null=True) 
    date_created = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return self.intitule_projet
    


class Partenaire(models.Model):

    nom=models.CharField(max_length=90,null=False)
    projets = models.ManyToManyField(Projet, through='Participation')
    def __str__(self):
        return self.nom
    


class Participation(models.Model):
    partenaire = models.ForeignKey(Partenaire, on_delete=models.CASCADE)
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE)
    contribution = models.DecimalField(max_digits=19, decimal_places=2)
    class Meta:
        unique_together = ('partenaire', 'projet')
    def __str__(self):
        return f"{self.projet} - {self.partenaire}"
   

    
class Reunion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    title = models.CharField(max_length=500)
    start = models.CharField(max_length=500)
    end = models.CharField(max_length=500,null=True)
    description = models.TextField(blank=True)
    def save(self, *args, **kwargs):
        if self.start:
            self.start = datetime.strptime(self.start, '%Y-%m-%dT%H:%M:%S.%fZ')
        if self.end:
            self.end = datetime.strptime(self.end, '%Y-%m-%dT%H:%M:%S.%fZ')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    

