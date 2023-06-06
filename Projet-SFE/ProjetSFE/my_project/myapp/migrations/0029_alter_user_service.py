# Generated by Django 4.2 on 2023-05-27 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0028_projet_date_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='service',
            field=models.CharField(choices=[('SCP', 'SCP'), ('SFMSP', 'SFMSP'), ('SPC', 'SPC'), ('SSCRC', 'SSCRC'), ('SRR', 'SRR'), ('SSPP', 'SSPP')], default='SCP', max_length=6),
        ),
    ]
