# Generated by Django 4.2 on 2023-04-25 18:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_alter_user_cnie_alter_user_ppr'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='cnie',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='date_recrutement',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='grade',
            field=models.CharField(max_length=90, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='ppr',
            field=models.PositiveIntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='service',
            field=models.CharField(max_length=90, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='specialite',
            field=models.CharField(max_length=90, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='telephone',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
