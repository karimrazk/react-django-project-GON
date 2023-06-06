# Generated by Django 4.2 on 2023-05-08 13:53

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0016_reunion_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='projet',
            name='users',
            field=models.ManyToManyField(related_name='projects', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='ProjetUser',
        ),
    ]
