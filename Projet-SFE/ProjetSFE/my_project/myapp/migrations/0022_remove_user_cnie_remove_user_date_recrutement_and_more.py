# Generated by Django 4.2 on 2023-05-11 20:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0021_alter_participation_unique_together'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='cnie',
        ),
        migrations.RemoveField(
            model_name='user',
            name='date_recrutement',
        ),
        migrations.RemoveField(
            model_name='user',
            name='grade',
        ),
        migrations.RemoveField(
            model_name='user',
            name='ppr',
        ),
        migrations.RemoveField(
            model_name='user',
            name='specialite',
        ),
        migrations.RemoveField(
            model_name='user',
            name='telephone',
        ),
    ]